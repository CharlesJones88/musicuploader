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
    app = docker.build(imageName)
  }
  
  stage('Push image') {
    docker.withRegistry('', registryCredentialSet) {
      app.push("${env.BUILD_NUMBER}")
      app.push("latest")
    }
  }
  stage('Deploy') {
    steps {
      echo 'Sending deployment request to Kubernetes...'
    }
  }
  stage('Cleanup') {
    steps {
      sh "docker rmi ${imageName}:${env.BUILD_NUMBER}"
    }
  }
}
