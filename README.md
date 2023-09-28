# Livesitter_Task
## API Documentation
This documentation includes details about the CRUD endpoints used to manage Overlays.

### Create Overlay
**Endpoint**: '/create'

**Request Method**: POST

**Description**: Creates and saves a new overlay for a user. The overlay can be of the type "text" or "Image". For text overlays, user provides selects the type in the form as 'text' and provide text content. For image overlays, user selects the type in the form as 'image' and uploads an image file in the given input area.

**Request Parameters**:
* user_email (string): The email of the user for whom the overlay is being created.
* name (string): The name of the overlay.
* type (string): The type of the overlay ('text' or 'image').
* x (string): The X-coordinate position of the overlay.
* y (string): The Y-coordinate position of the overlay.
* h (string): The height of the overlay.
* w (string): The width of the overlay.
* content (string, optional): The content of the overlay (required for 'text' overlays).
* file (file, optional): The image file (required for 'image' overlays).

**Response**: JSON object representing the newly created overlay, to be used to generate the ReactJS element.

### Get user's overlays
**Endpoint**: /get/<user_email>'

**Request Method**: GET

**Description**: Retrieve all saved overlays associated with a user.

**Request Parameters**:
* user_email (string): The email of the user whose overlays are to be retrieved

**Response**:JSON array containing objects representing user's overlays


### Get overlay image
**Endpoint**: /get/<overlay_id>/<user_email>'

**Request Method**: GET

**Description**: Retrieve all Image files associated with an overlay.

**Request Parameters**:
* overlay_id (string): the ID of the overlay for which the image is to be retrieved.
* user_email (string): The email of the user associated with the overlay

**Response**: Image file associated with the overlay


### Update overlay
**Endpoint**: /update'

**Request Method**: POST

**Description**: Update the position (X,Y coordinates) and size (height, width) of an overlay.

**Request Parameters**:
* id (string): The ID of the overlay to be updated.
* x (string): The new X-coordinate position.
* y (string): The new Y-coordinate position.
* w (string): The new width.
* h (string): The new height.

**Response**: JSON object with success message


### Delete overlay
**Request Method**: GET

**Endpoint**: /get/<overlay_id>/<user_email>'

**Description**: Delete an overlay associated with a user.

**Request Parameters**:
* overlay_id (string): The ID of the overlay to be deleted.
* user_email (string): The email of the user associated with the overlay.

**Response**: JSON object with success message


## User Documentation
This documentation includes details about using the app and managing the overlays.

### Play / Pause the Live Video.
* Press the play button to start the live stream and pause button to pause the live stream.

### Manage overlays.
* Press the 'Add New Overlay' button. This opens the form for creating a new overlay.
* The form contains three fields:
  * Name - Name of the overlay
  * Type - Type of overlay (text / image)
  * Text / Image - Content for the overlay. Changes with the type.
* After filling all fields, press the 'Create' button. This will create a new overlay and display it on the video area.
* To change the position and size of the overlays, press on the 'Edit Overlays' button. User should see a dashed line around the overlay to indicate that it is editable. Press Finish Editing when done.
* To delete an overlay, hover over it. The user will be able to see a delete button (Trash icon). Press on the button to delete the overlay permanently.

### To Dos
* Add user authentication
* Add volume control for the live stream
* Add font styling for text overlays
* Styling

### Known bugs
* Video stream displays broken image when paused.
* Image overlays show broken image until hovered or editing is enabled.
