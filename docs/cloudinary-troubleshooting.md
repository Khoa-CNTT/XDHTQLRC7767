# Cloudinary Integration Troubleshooting

If you're experiencing issues with your Cloudinary integration, follow this guide to resolve common problems.

## 400 Bad Request Error

If you're seeing a "400 Bad Request" error when trying to upload images, it's likely related to your upload preset configuration:

### 1. Verify Your Upload Preset Exists

1. Log in to your [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Go to Settings (gear icon) > Upload > Upload presets
3. Make sure the preset name matches exactly what you have in your `.env` file
4. If the preset doesn't exist, create a new one

### 2. Ensure Your Upload Preset is Unsigned

For client-side uploads without authentication, your upload preset must be set to "Unsigned":

1. In your Cloudinary Dashboard, go to Settings > Upload > Upload presets
2. Find your preset and click to edit it
3. Under "Signing Mode", select "Unsigned"
4. Save the changes

![Unsigned Upload Preset](https://res.cloudinary.com/demo/image/upload/c_scale,w_700/v1597309057/unsigned_upload_preset.jpg)

### 3. Check Your Environment Variables

Make sure your environment variables are correctly set in your `.env` file:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
```

- The `CLOUD_NAME` must match exactly what's shown in your dashboard
- The `UPLOAD_PRESET` must match the name of your unsigned upload preset
- For Vite applications, all environment variables must start with `VITE_`

### 4. Restart Your Development Server

After making changes to your `.env` file or Cloudinary settings, restart your development server to ensure the changes take effect.

## Common Troubleshooting Steps

1. **Check Console Logs**: Look for detailed error messages in your browser console
2. **Verify CORS Settings**: In your Cloudinary dashboard, make sure your application's domain is allowed in the CORS settings
3. **Use the Cloudinary Upload Widget**: If direct API uploads aren't working, try using Cloudinary's official Upload Widget

## Still Having Issues?

If you're still experiencing problems, try these additional steps:

1. Check the Cloudinary API response details in your browser's Network tab
2. Verify that your Cloudinary account is active and not exceeded its limits
3. Test a simple upload using the Cloudinary API Postman collection

For further assistance, refer to the [Cloudinary Documentation](https://cloudinary.com/documentation/upload_images) or contact Cloudinary support.
