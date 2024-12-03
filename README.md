Para abrir todo:

*Primero descargar los repositorios:

https://github.com/FranciscoDominguezT/FutTracking-Node
https://github.com/FranciscoDominguezT/FutTracking-ReactNative

*Ejecutar NPM I en los dos repositorios una vez descargados y abiertos

*Abrir el túnel de Ngrok:

Pararse en la carpeta:
ngrok-v3-stable-windows-amd64

Y ejecutar desde la CMD:

ngrok config add-authtoken $YOUR_AUTHTOKEN
ngrok update
ngrok http --domain=$YOUR_DOMAIN $YOUR_PORT

Una vez hecho esto:

*Ejecutar npm run dev en nuestro proyecto de Node
*Ejecutar npx expo start --tunnel en nuestro proyecto de React Native