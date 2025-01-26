
# Object Panel Component

## Greyed Out Objects

Objects in the sidebar panel become visually disabled (greyed out) when they have been placed on the canvas. This provides visual feedback to users about which objects are available for use.

### Visual Indicators
- Opacity reduced to 50%
- Cursor changed to "not-allowed"
- Drag functionality disabled

### Implementation
The feature is implemented in the `DraggableItem` component using:
- CSS classes controlled by the `isPlaced` prop
- React DnD's `canDrag` property to prevent dragging of placed objects

### Usage Example
```tsx
<DraggableItem 
  object={object}
  isPlaced={true} // Object will appear greyed out
/>
```

This feature helps maintain a clear visual state of which objects are already in use on the canvas.
