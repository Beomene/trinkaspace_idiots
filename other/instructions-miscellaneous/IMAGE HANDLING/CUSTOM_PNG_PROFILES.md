# Adding Custom PNG Profile Pictures

This guide explains how to add your own custom PNG profile pictures to the Trinkaspace user system.

## File Requirements

- **Format**: PNG with transparency
- **Size**: 256x256 pixels recommended (will be displayed smaller)
- **Content**: Characters, icons, or other profile-appropriate imagery
- **Background**: Transparent

## Adding New PNG Profile Pictures

1. Create your PNG profile images
2. Save them to the `/assets/images/profile-pics/png/` directory
3. Update the `getProfilePictureOptions()` method in `userManager.js`

### Example of Adding PNG Profiles

To add custom PNG profiles, edit the `getProfilePictureOptions()` method in `userManager.js`:

```javascript
getProfilePictureOptions() {
  return [
    // Existing SVG options
    { filename: 'default.svg', name: 'Default', type: 'svg' },
    { filename: 'red.svg', name: 'Red', type: 'svg' },
    // ...other SVG options...
    
    // Add your PNG options here
    { filename: 'png/character1.png', name: 'Character 1', type: 'png' },
    { filename: 'png/character2.png', name: 'Character 2', type: 'png' },
  ];
}
```

## Creating Profile Pictures

When creating profile pictures, consider the following:

1. Use a circular shape for the main image
2. Allow for some padding around the edges
3. The display will have a decorative frame, so ensure the content is clear within the circular area

## Example File Structure

```
assets/
  images/
    profile-pics/
      default.svg
      red.svg
      green.svg
      blue.svg
      yellow.svg
      purple.svg
      png/
        character1.png
        character2.png
        character3.png
```

## Testing

After adding new profile pictures, use the test page at `/other/tests/profile_pic_test.html` to see how they look in the interface.
