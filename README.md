![Screenshot_4](https://github.com/voronine/AppGameMobile/blob/main/src/assets/Screenshot_4.png)

This project is a mobile application developed using React Native CLI. It incorporates the following key functional elements:

SDK Integration
The application integrates the following SDKs with fake identifiers:

Appsflyer
Firebase
Data Storage
AsyncStorage is used for local data persistence on the user's device.

Application Logic

Geolocation Request: Upon launch, the app requests the user's geolocation data.
If the user's geolocation does not correspond to Ukraine, a WebView opens displaying the Wikipedia page.
If the user's geolocation is determined as Ukraine, the WebView is hidden and the main app content is displayed.
Main Content – Memory Training Game
The game functions as follows:

At the start of a level, the user is shown a game field with cards for one to two seconds, with all cards revealed.
After that, the cards flip to their hidden side, and the user must memorize their positions.
Next, the player is required to sequentially select pairs of matching cards located in the cells that were initially revealed.
A level is considered completed when the player successfully uncovers all the cells, demonstrating their memory ability.
Design and User Interface
The design serves as a technical specification according to which the developer implements the required functionality and UI.

Deliverables

The source code of the project (excluding the node_modules folder) is provided either as an archive or via a link to a Git repository.
A built APK file is provided, in which the following logic works correctly:
If the user's geolocation is not Ukraine, a WebView opens with the Wikipedia website.
If the user's geolocation is Ukraine, the WebView is hidden and the main content (the game) is displayed.
