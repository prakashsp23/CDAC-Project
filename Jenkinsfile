    // CD pipeline: build images on Docker agent, push to Hub, update manifests in Git.
    // Manifest repo is separate: set MANIFESTS_REPO_URL in Jenkins; Jenkins clones it and updates k8s/*.yaml there.
    pipeline {
        agent {
            docker {
                image 'docker:24'
                args '-v /var/run/docker.sock:/var/run/docker.sock'
                reuseNode true
            }
        }

        options {
            buildDiscarder(logRotator(numToKeepStr: '5'))
            timeout(time: 30, unit: 'MINUTES')
            timestamps()
        }

        environment {
            IMAGE_TAG = env.BUILD_NUMBER ?: 'latest'
            // Optional: separate repo for k8s manifests. Empty = update and push in this repo.
            MANIFESTS_REPO_URL = "https://github.com/prakashsp23/cdac-project-manifest"
        }

        stages {
            stage('Checkout') {
                when { branch 'main' }
                steps {
                    sh 'apk add --no-cache git'
                    checkout scm
                }
            }

            stage('Build & Push Docker Images') {
                when { branch 'main' }
                steps {
                    script {
                        def dockerHubUser = getDockerHubUsername()
                        def backendImage = "${dockerHubUser}/carservice-backend:${IMAGE_TAG}"
                        def frontendImage = "${dockerHubUser}/carservice-frontend:${IMAGE_TAG}"

                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                            def backendBuild = docker.build(backendImage, '-f server/Dockerfile server/')
                            backendBuild.push()
                            backendBuild.push('latest')

                            def frontendBuild = docker.build(frontendImage, '-f client/Dockerfile client/')
                            frontendBuild.push()
                            frontendBuild.push('latest')
                        }
                    }
                }
            }

            stage('Update Git & Trigger Argo CD') {
                when { branch 'main' }
                steps {
                    script {
                        def dockerHubUser = getDockerHubUsername()
                        def manifestsRepo = (env.MANIFESTS_REPO_URL ?: '').trim()
                        withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                            sh """
                                MANIFESTS_REPO_URL='${manifestsRepo.replaceAll("'", "'\\\\''")}'
                                if [ -n "\$MANIFESTS_REPO_URL" ]; then
                                  git clone "https://\${GIT_USER}:\${GIT_PASS}@\${MANIFESTS_REPO_URL#https://}" manifests-repo
                                  cd manifests-repo
                                  MANIFEST_BASE=k8s
                                else
                                  MANIFEST_BASE=manifest/k8s
                                fi
                                for f in \$MANIFEST_BASE/backend-deployment.yaml \$MANIFEST_BASE/frontend-deployment.yaml; do
                                  sed -i 's|DOCKER_HUB_PLACEHOLDER|${dockerHubUser}|g' \$f
                                  sed -i 's|IMAGE_TAG_PLACEHOLDER|${IMAGE_TAG}|g' \$f
                                done
                                git config user.email "jenkins@localhost" && git config user.name "Jenkins"
                                git add \$MANIFEST_BASE/backend-deployment.yaml \$MANIFEST_BASE/frontend-deployment.yaml
                                if ! git diff --staged --quiet; then
                                  git commit -m 'Deploy image tag ${IMAGE_TAG}'
                                  REPO_HTTPS=\$(git remote get-url origin | sed "s|git@github.com:|https://github.com/|" | sed "s|\\.git\$||" | sed "s|https://||")
                                  git push "https://\${GIT_USER}:\${GIT_PASS}@\${REPO_HTTPS}" HEAD:main
                                fi
                            """
                        }
                    }
                }
            }
        }

        post {
            success {
                echo 'Pipeline completed. Images pushed to Docker Hub; Git updated. Argo CD will sync to k3s.'
            }
            failure {
                echo 'Pipeline failed. Check the logs above.'
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
