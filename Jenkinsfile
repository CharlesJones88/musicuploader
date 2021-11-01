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
  stage('Clone Chart Repo') {
    sh "git clone ${env.CHART_REPO}"
  }
  stage('Update chart repo version') {
    environment {
      valuesData = ''
      chartData = ''
    }
    valuesData = readYaml(file:'music-uploader-fleet/music-uploader/values.yaml')
    sh "echo $valuesData"
    valuesData.image.tag = "${env.BUILD_NUMBER}"
    writeYaml(file:'music-uploader-fleet/music-uploader/values.yaml', data:valuesData)
    
    
  }
  stage('Deploy') {
    echo 'Sending deployment request to Kubernetes...'
  }
  stage('Cleanup') {
    sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
  }
}
