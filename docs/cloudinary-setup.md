# Cloudinary Integration Setup

This application uses Cloudinary for image storage and management. Follow these steps to set up your own Cloudinary account and connect it to the application.

## Step 1: Create a Cloudinary Account

1. Go to the [Cloudinary website](https://cloudinary.com/) and sign up for a free account
2. After signing up, you'll be taken to your Cloudinary dashboard

## Step 2: Get Your Cloudinary Credentials

From your Cloudinary dashboard, you'll need to collect the following information:

- **Cloud Name**: This is shown in the top right corner of your dashboard
- **API Key**: Found in the "Account Details" section
- **API Secret**: Found in the "Account Details" section

## Step 3: Create an Upload Preset

To enable unsigned uploads from your front-end application:

1. Go to Settings > Upload in your Cloudinary dashboard
2. Scroll down to "Upload presets" and click "Add upload preset"
3. Give it a name (e.g., "ml_default" or "react_uploads")
4. Set the "Signing Mode" to "Unsigned"
5. Optional: Configure other settings like folder path, transformations, etc.
6. Save the preset

## Step 4: Configure the Application

Update your `.env` file with your Cloudinary credentials. Since this project uses Vite, environment variables need to be prefixed with `VITE_`:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Note**: With Vite, only environment variables prefixed with `VITE_` are exposed to your client-side code.

## Using Cloudinary in the Application

The application includes a `CloudinaryUpload` component that handles the image upload process:

```jsx
import CloudinaryUpload from "../components/common/CloudinaryUpload";

// In your form:
<Form.Item name="image" label="Upload Image">
  <CloudinaryUpload onChange={(url) => form.setFieldValue("image", url)} />
</Form.Item>;
```

The component will:

1. Allow users to select an image
2. Upload it directly to Cloudinary
3. Return the secure URL of the uploaded image
4. Display a preview of the uploaded image

## Security Considerations

- The API Secret should only be used on the server side
- For client-side uploads, always use unsigned upload presets
- Consider adding upload restrictions (file types, sizes, etc.) in your Cloudinary settings
- For production, set appropriate CORS settings in your Cloudinary dashboard

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
