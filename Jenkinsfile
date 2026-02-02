pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        MANIFESTS_REPO_URL = "https://github.com/prakashsp23/cdac-project-manifest"
    }

    stages {

        stage('Prepare Build Variables') {
            steps {
                script {
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}"
                    echo "Using IMAGE_TAG=${env.IMAGE_TAG} (build number)"
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def dockerHubUser = getDockerHubUsername()

                    def backendImage  = "${dockerHubUser}/carservice-backend:${env.IMAGE_TAG}"
                    def frontendImage = "${dockerHubUser}/carservice-frontend:${env.IMAGE_TAG}"

                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {

                        echo "Building Backend Image: ${backendImage}"
                        def backendBuild = docker.build(backendImage, '-f server/Dockerfile server/')
                        backendBuild.push()
                        backendBuild.push('latest')

                        
                        withCredentials([string(credentialsId: 'VITE_STRIPE_PUBLISHABLE_KEY', variable: 'VITE_STRIPE_PUBLISHABLE_KEY')]) {

                            def frontendBuildArgs = "--build-arg VITE_API_URL=/api " +
                                                    "--build-arg VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}"

                            echo "Building Frontend Image: ${frontendImage}"
                            def frontendBuild = docker.build(frontendImage, "${frontendBuildArgs} -f client/Dockerfile client/")
                            frontendBuild.push()
                            frontendBuild.push('latest')
                        }
                    }
                }
            }
        }

        stage('Update Manifest Repo (GitOps)') {
            steps {
                script {
                    def dockerHubUser = getDockerHubUsername()
                    def manifestsRepo = (env.MANIFESTS_REPO_URL ?: '').trim()

                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                            set -e
                            MANIFESTS_REPO_URL='${manifestsRepo.replaceAll("'", "'\\\\''")}'
                            git clone "https://\${GIT_USER}:\${GIT_PASS}@\${MANIFESTS_REPO_URL#https://}" manifests-repo
                            cd manifests-repo
                            MANIFEST_BASE=k8s

                            echo "Updating manifests with tag ${IMAGE_TAG}"

                            sed -i 's|image: .*/carservice-backend:.*|image: ${dockerHubUser}/carservice-backend:${IMAGE_TAG}|g' \$MANIFEST_BASE/backend-deployment.yaml
                            sed -i 's|image: .*/carservice-frontend:.*|image: ${dockerHubUser}/carservice-frontend:${IMAGE_TAG}|g' \$MANIFEST_BASE/frontend-deployment.yaml

                            git config user.email "jenkins@localhost"
                            git config user.name "Jenkins"

                            git add .
                            git commit -m "Deploy image tag ${IMAGE_TAG}" || echo "No changes to commit"
                            git push origin HEAD:main
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment pipeline completed. Argo CD will sync.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        always {
            cleanWs(deleteDirs: true)
            sh 'docker system prune -f || true'
        }
    }
}

def getDockerHubUsername() {
    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        return env.DOCKER_USER
    }
}
