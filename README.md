Para abrir todo:

*Primero descargar los repositorios:

https://github.com/FranciscoDominguezT/FutTracking-Node
https://github.com/FranciscoDominguezT/FutTracking-ReactNative

*Ejecutar NPM I en los dos repositorios una vez descargados y abiertos

*Abrir el túnel de Ngrok:

Pararse en la carpeta:
ngrok-v3-stable-windows-amd64

Y ejecutar desde la CMD:

ngrok config add-authtoken 2kkEqZrSdnRaky7oRRWRBUlNgmV_3WNaS1oUE2c9fTKddpRkS
ngrok update
ngrok http --domain=open-moderately-silkworm.ngrok-free.app 5001

Una vez hecho esto:

*Cambiar el nombre de app.js a App.js
*Ejecutar npm run dev en nuestro proyecto de Node
*Ejecutar npx expo start --tunnel en nuestro proyecto de React Native