pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        IMAGE_TAG = "latest"
        MANIFESTS_REPO_URL = "https://github.com/prakashsp23/cdac-project-manifest"
    }

    stages {

        stage('Prepare Build Variables') {
            steps {
                script {
                    env.IMAGE_TAG = env.BUILD_NUMBER ?: "latest"
                    echo "Using IMAGE_TAG=${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def dockerHubUser = getDockerHubUsername()

                    def backendImage = "${dockerHubUser}/carservice-backend:${env.IMAGE_TAG}"
                    def frontendImage = "${dockerHubUser}/carservice-frontend:${env.IMAGE_TAG}"

                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {

                        echo "Building Backend Image: ${backendImage}"
                        def backendBuild = docker.build(backendImage, '-f server/Dockerfile server/')
                        backendBuild.push()
                        backendBuild.push('latest')

                        echo "Building Frontend Image: ${frontendImage}"
                        def frontendBuild = docker.build(frontendImage, '-f client/Dockerfile client/')
                        frontendBuild.push()
                        frontendBuild.push('latest')
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

                            for f in \$MANIFEST_BASE/backend-deployment.yaml \$MANIFEST_BASE/frontend-deployment.yaml; do
                              sed -i 's|DOCKER_HUB_PLACEHOLDER|${dockerHubUser}|g' \$f
                              sed -i 's|IMAGE_TAG_PLACEHOLDER|${IMAGE_TAG}|g' \$f
                            done

                            git config user.email "jenkins@localhost"
                            git config user.name "Jenkins"

                            git add .
                            git commit -m "Deploy image tag ${IMAGE_TAG}" || echo "No changes to commit"

                            REPO_HTTPS=\$(git remote get-url origin | sed "s|git@github.com:|https://github.com/|" | sed "s|\\.git\$||" | sed "s|https://||")
                            git push "https://\${GIT_USER}:\${GIT_PASS}@\${REPO_HTTPS}" HEAD:main
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
        }
    }
}

def getDockerHubUsername() {
    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        return env.DOCKER_USER
    }
}
