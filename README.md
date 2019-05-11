Cloud Storage App

Directory Structure -

app         - The complete backend logic goes here  
config      - Environment specific configuration  
lib         - Customized Library files  
test        - Test cases  
ui          - The frontend code goes here  


-----------------------------------------------------   

Requirements :

1. NodeJS (Recommended 8+)  
2. Working internet connection  

To run backend server, execute these commands -  
    1. npm install  
    2. npm start  

To stop backend server, execute this command  
    npm stop  


To run frontend server, execute these commands  
    node .\ui\server.js    (Windows Powershell)  


P.S. > If you are not accessing this server from localhost, you need to change the variable SERVER_BASE_URL at ui/app/utils/constants.js
