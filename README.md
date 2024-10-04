# Api Rick & Morty

Los pasos a seguir para interactuar con esta API son en primer lugar, instalar las dependencias con:</br>
npm create vite@latest</br>
npm install</br>

Con la instalación creamos una estructura de carpetas.</br>
![alt text](src/images/image.png)</br>
Crearemos carpetas adicionales para los componentes y las vistas.</br>
Con el comando: npm run dev, podremos acceder a un front básico desde el navegador, al que le daremos forma y funcionalidades.</br>
Para poder enlazar las rutas instalaremos React Router Dom con el comando npm i react-router-dom. </br>
Para configurar las rutas envolvemos en una entiqueta denominada BrowserRouter el archivo App.</br>
![alt text](image.png).</br>
Despues crearemos nuestro componente para las rutas.</br>
![alt text](image-1.png)</br>
En el alojaremos todas las rutas de nuestras vistas. Para poder movernos entre  vistas debemos instanciar el hook useNavigate.</br>
## Ejemplo.
![alt text](image-2.png)</br>

Tambien instalaremos axios con npm i axios, para poder interactuar con cualquien back-end. Ya podremos crear las llamadas a la API</br>
## Ejemplo.
![alt text](image-3.png)</br>
![alt text](image-4.png)</br>

Una vez conseguimos setear los personajes podremos asignarles atributos como el nombre por ejemplo y mostrarlos en una lista ordenada.