pipeline{
    agent any
    tools {nodejs "NodeJS"}
    stages {
        stage("Install"){
            steps{
                sh "npm install"
            }
        }
        stage("Build"){
            steps{
                sh "npm start"
            }
        }
      
        // stage("Deploy"){
        //      steps{
        //          sh "rm -rf /usr/share/nginx/html/AngularProject/dist/"
        //          sh "cp - R /var/lib/jenkins/workspace/AngularProject/dist /usr/share/nginx/html/AngularProject/dist"
        //      }
        //  }
      
    }
}
