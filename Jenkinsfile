node {
  def app
  environment {
    imageName = 'ultramixerman/musicuploader'
    registryCredentialSet = 'dockerhub'
  }
  stage('Clone repository') {
    checkout scm
  }
  
  stage('Build image') {
    app = docker.build(env.IMAGE_NAME)
  }
  
  stage('Push image') {
    docker.withRegistry('', env.registryCredentialSet) {
      app.push("${env.BUILD_NUMBER}")
      app.push("latest")
    }
  }
  stage('Deploy') {
    echo 'Sending deployment request to Kubernetes...'
  }
  stage('Cleanup') {
    sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
  }
}
