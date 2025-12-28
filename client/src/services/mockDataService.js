const API_URL = 'http://localhost:5000';

// Helpers
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

// -- GET Data --

export const getServiceCatalog = async () => {
  const response = await fetch(`${API_URL}/service_catalog`);
  return handleResponse(response);
};

export const getUserVehicles = async (userId) => {
  const response = await fetch(`${API_URL}/cars?user_id=${userId}&status=ACTIVE`);
  return handleResponse(response);
};

export const getUserAppointments = async (userId) => {
  // Parallel fetch for efficiency
  const [servicesRes, catalogRes, carsRes] = await Promise.all([
    fetch(`${API_URL}/services?status=ONGOING&status=REQUESTED`),
    fetch(`${API_URL}/service_catalog`),
    fetch(`${API_URL}/cars`)
  ]);

  const services = await handleResponse(servicesRes);
  const catalog = await handleResponse(catalogRes);
  const cars = await handleResponse(carsRes);

  const userCarsIds = cars.filter(c => c.user_id == userId).map(c => c.car_id); 

  return services
    .filter(s => userCarsIds.includes(s.car_id))
    .map(s => {
      const cat = catalog.find(c => c.catalog_id === s.catalog_id);
      const car = cars.find(c => c.car_id === s.car_id);
      return {
        ...s,
        service_name: cat ? cat.service_name : 'Unknown Service',
        car_details: car ? `${car.year} ${car.brand} ${car.model}` : 'Unknown Car'
      };
    });
};

export const getUserServiceHistory = async (userId) => {
  const [servicesRes, catalogRes, carsRes] = await Promise.all([
    fetch(`${API_URL}/services`),
    fetch(`${API_URL}/service_catalog`),
    fetch(`${API_URL}/cars`)
  ]);

  const services = await handleResponse(servicesRes);
  const catalog = await handleResponse(catalogRes);
  const cars = await handleResponse(carsRes);

  const userCarsIds = cars.filter(c => c.user_id == userId).map(c => c.car_id);

  return services
    .filter(s => userCarsIds.includes(s.car_id))
    .map(s => {
      const cat = catalog.find(c => c.catalog_id === s.catalog_id);
      const car = cars.find(c => c.car_id === s.car_id);
      return {
        ...s,
        service_name: cat ? cat.service_name : 'Unknown Service',
        description: cat ? cat.description : '',
        car_details: car ? `${car.year} ${car.brand} ${car.model}` : 'Unknown Car'
      };
    });
};

export const getUserFeedbacks = async (userId) => {
  const [feedbackRes, servicesRes, catalogRes, notesRes] = await Promise.all([
    fetch(`${API_URL}/feedback?user_id=${userId}`),
    fetch(`${API_URL}/services`),
    fetch(`${API_URL}/service_catalog`),
    fetch(`${API_URL}/mechanic_notes`)
  ]);

  const feedbacks = await handleResponse(feedbackRes);
  const services = await handleResponse(servicesRes);
  const catalog = await handleResponse(catalogRes);
  const notes = await handleResponse(notesRes);

  return feedbacks.map(f => {
    const service = services.find(s => s.service_id === f.service_id);
    const cat = service ? catalog.find(c => c.catalog_id === service.catalog_id) : null;
    const mechanicNotes = notes.filter(n => n.service_id === f.service_id).map(n => n.description).join('; ');

    return {
      id: f.feedback_id,
      service: cat ? cat.service_name : 'Service #' + f.service_id,
      date: f.date,
      rating: f.rating,
      comment: f.comments,
      mechanicNotes: mechanicNotes
    };
  });
};

export const getCompletedServicesForFeedback = async (userId) => {
  const [servicesRes, carsRes, catalogRes, feedbackRes] = await Promise.all([
    fetch(`${API_URL}/services?status=COMPLETED`),
    fetch(`${API_URL}/cars?user_id=${userId}`),
    fetch(`${API_URL}/service_catalog`),
    fetch(`${API_URL}/feedback?user_id=${userId}`)
  ]);

  const services = await handleResponse(servicesRes);
  const cars = await handleResponse(carsRes);
  const catalog = await handleResponse(catalogRes);
  const feedbacks = await handleResponse(feedbackRes);

  const userCarIds = cars.map(c => c.car_id);
  const feedbackServiceIds = feedbacks.map(f => f.service_id);

  return services
    .filter(s => userCarIds.includes(s.car_id) && !feedbackServiceIds.includes(s.service_id))
    .map(s => {
      const cat = catalog.find(c => c.catalog_id === s.catalog_id);
      return {
        id: s.service_id,
        name: cat ? cat.service_name : 'Service',
        date: s.created_at ? s.created_at.split('T')[0] : 'N/A'
      };
    });
};


// -- POST / DELETE Actions (Persistence) --

export const addVehicle = async (vehicleData) => {
  // We explicitly generate 'id' to fix json-server "Cannot read property 'id'" error.
  const allCars = await handleResponse(await fetch(`${API_URL}/cars`));
  const maxId = allCars.reduce((max, c) => Math.max(max, c.id || 0), 0);
  
  const newCar = {
    id: maxId + 1, // Standard id
    car_id: maxId + 1, // Compatibility id
    user_id: 1, 
    ...vehicleData,
    status: 'ACTIVE'
  };

  const response = await fetch(`${API_URL}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCar)
  });
  return handleResponse(response);
};

export const deleteVehicle = async (vehicleId) => {
  // Now we can rely on standard 'id' which matches 'car_id' mostly, but let's look up to be safe
  const cars = await handleResponse(await fetch(`${API_URL}/cars?car_id=${vehicleId}`));
  if (cars.length === 0) throw new Error("Vehicle not found");
  
  const internalId = cars[0].id;
  
  const response = await fetch(`${API_URL}/cars/${internalId}`, {
      method: 'DELETE'
  });
  return handleResponse(response);
};

export const bookService = async (bookingData) => {
   // bookingData: { vehicleId, service (id), notes, date }
   const catalog = await getServiceCatalog();
   
   const serviceItem = catalog.find(s => String(s.catalog_id) === String(bookingData.service));

   if (!serviceItem) throw new Error("Service not found in catalog");

   const allServices = await handleResponse(await fetch(`${API_URL}/services`));
   const maxId = allServices.reduce((max, s) => Math.max(max, s.id || 0), 0);
   const nextId = maxId + 1;

   const newService = {
       id: nextId,
       service_id: nextId,
       catalog_id: serviceItem.catalog_id,
       car_id: bookingData.vehicleId,
       mechanic_id: null,
       status: 'REQUESTED',
       base_price: serviceItem.base_price,
       parts_total: 0,
       total_amount: serviceItem.base_price,
       cancelled_by_admin: false,
       cancellation_reason: null,
       cancelled_at: null,
       notes: bookingData.notes || "", 
       // created_at handled by server middleware
   };

   const response = await fetch(`${API_URL}/services`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newService)
   });
   return handleResponse(response);
};

export const submitFeedback = async (feedbackData) => {
    const allFeedback = await handleResponse(await fetch(`${API_URL}/feedback`));
    const maxId = allFeedback.reduce((max, f) => Math.max(max, f.id || 0), 0);
    const nextId = maxId + 1;
    
    const newFeedback = {
        id: nextId,
        feedback_id: nextId,
        user_id: 1, 
        service_id: parseInt(feedbackData.serviceId),
        rating: feedbackData.rating,
        comments: feedbackData.comment,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        admin_note: ""
    };
    
    const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback)
    });
    return handleResponse(response);
};
