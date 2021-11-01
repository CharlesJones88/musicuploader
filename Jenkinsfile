node {
  def app
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
  environment {
    imageName = 'ultramixerman/musicuploader'
    registryCredentialSet = 'dockerhub'
  }
}
