import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import BookService from './BookService';

// A simple component to render SVG strings safely
const SvgIcon = ({ svgString, ...props }) => {
  return <div {...props} dangerouslySetInnerHTML={{ __html: svgString }} />;
};

export default function ServiceDetailDialog({ service, open, onOpenChange }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentService, setCurrentService] = useState(service);

  useEffect(() => {
    // Update the current service only when a new, valid service prop is passed
    if (service) {
      setCurrentService(service);
    }
  }, [service]);

  if (!currentService) {
    return null;
  }

  const handleBooking = () => {
    onOpenChange(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader className="py-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 text-primary flex-shrink-0 flex items-center justify-center bg-muted/50 rounded-lg">
                <SvgIcon svgString={currentService.svg} className="w-10 h-10" />
              </div>
              <div className="flex-grow">
                <DialogTitle className="text-xl font-bold">{currentService.name}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">{currentService.description}</DialogDescription>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-bold">₹ {currentService.price.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Starting Price</p>
              </div>
            </div>
          </DialogHeader>
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">What's Included:</h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
              {currentService.coveredPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={handleBooking} className="ml-2" variant="default">
              Book This Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <BookService
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        defaultServiceName={currentService.name}
      />
    </>
  );
}