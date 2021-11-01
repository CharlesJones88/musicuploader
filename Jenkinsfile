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
    sh "ls -altroh"
    valuesData = readYaml(file:currentvaluesFile)
    sh "echo $valuesData"
    valuesData.image.tag = "${env.BUILD_NUMBER}"
    sh "rm ${currentvaluesFile}"
    writeYaml(file:currentvaluesFile, data:valuesData)
  }
  stage('Deploy') {
    echo 'Sending deployment request to Kubernetes...'
  }
  stage('Cleanup') {
    sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
  }
}
