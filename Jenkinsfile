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
    sh "whoami"
    sshagent (credentials: ["${env.git}"]) {
      sh "git clone ${env.CHART_REPO}"
    }
  }
  stage('Deploy') {
    environment {
      valuesData = ''
      chartData = ''
    }
    helmFolder = 'music-uploader-fleet/music-uploader'
    valuesData = readYaml(file:"${helmFolder}/values.yaml")
    valuesData.image.tag = "${env.BUILD_NUMBER}"
    sh "rm ${helmFolder}/values.yaml"
    writeYaml(file:"${helmFolder}/values.yaml", data:valuesData)
    
    chartData = readYaml(file:"${helmFolder}/Chart.yaml")
    chartData.version = env.BUILD_NUMBER
    chartData.appVersion = "${env.BUILD_NUMBER}"
    sh "rm ${helmFolder}/Chart.yaml"
    writeYaml(file:"${helmFolder}/Chart.yaml", data:chartData)
    
    sshagent (credentials: ["${env.git}"]) {
      sh "ls"
      sh("cd music-uploader-fleet && git add . && git commit -m 'Jenkins: bump docker image version to ${env.BUILD_NUMBER}' && git push -u origin main && cd .. && rm -rf music-uploader-fleet")
    } 
  }
  stage('Cleanup') {
    sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
  }
}
