# Structured Content Management Proposal

## Overview

This document proposes a structured approach to content management for the Trinkaspace project. The goal is to create a more maintainable, scalable, and efficient system for managing the diverse content types within the application while providing clear architectural guidelines.

## Current Challenges

1. **Content Organization**
   - Directory structure lacks consistent patterns
   - Mixed content types (JSON config, images, markdown) without clear separation
   - Unclear relationships between related content elements

2. **Content Creation**
   - Manual creation of complex nested folder structures
   - Repetitive configuration across similar content types
   - Lack of template-based approach for new content

3. **Content Maintenance**
   - Difficulty in finding specific content
   - Challenges in understanding relationships between content pieces
   - No centralized metadata or indexing system

4. **Technical Architecture**
   - No clear separation between content and presentation logic
   - Mixed concerns in configuration files
   - Redundant configuration across files

## Proposed Solution

### 1. Unified Content Model

Create a standardized content model that defines:

- **Content Types**: Clear definition of each type (diorama, textbox, HUD element, etc.)
- **Content Schema**: For each type, define required and optional fields
- **Content Relations**: Define how content types relate to each other
- **Content Lifecycle**: Define creation, update, deletion processes

### 2. Centralized Configuration

Implement a centralized configuration approach:

- **Central Registry**: Create a central registry of all content elements
- **Content Index**: Generate and maintain an index of all content for fast lookup
- **Content Maps**: Visual representation of content relationships
- **Configuration Inheritance**: Allow global defaults with local overrides

### 3. Directory Structure Standardization

Reorganize directory structure for clarity and consistency:

```
content/
  ├── chapters/
  │   ├── chapter_1/
  │   │   ├── metadata.json         # Chapter metadata
  │   │   ├── pages/
  │   │   │   ├── 001_001/
  │   │   │   │   ├── config.json   # Page configuration 
  │   │   │   │   ├── assets/       # Page-specific assets
  │   │   │   │   ├── dioramas/     # Diorama configurations
  │   │   │   │   └── textboxes/    # Text content
  │   │   │   └── ...
  │   │   └── global/               # Chapter-wide resources
  │   └── ...
  ├── shared/                       # Shared resources across chapters
  │   ├── characters/               # Character definitions
  │   ├── templates/                # Content templates
  │   └── ui/                       # UI elements
  └── config/                       # Global configuration
      ├── content_types.json        # Content type definitions
      ├── relationships.json        # Content relationship mapping
      └── navigation.json           # Navigation structure
```

### 4. Content Creation Tools

Develop tools to facilitate content creation:

- **Template Generator**: Tool to generate scaffolding for new content
- **Content Validator**: Automatic validation against schema
- **Visual Editor**: GUI for managing content relationships
- **CLI Tools**: Command-line tools for batch operations

### 5. Content API

Create a consistent API for accessing content:

- **Content Loading**: Standardized methods for loading different content types
- **Content Queries**: Query interface for finding content by criteria
- **Content Transformations**: Methods for transforming content for different contexts
- **Content Events**: Event system for content lifecycle notifications

## Implementation Plan

### Phase 1: Content Modeling and Analysis

1. Audit existing content and create inventory
2. Define content types and schemas
3. Create relationship maps between content
4. Design new directory structure

### Phase 2: Core Infrastructure

1. Create centralized configuration system
2. Implement content registry and indexing
3. Develop content API foundation
4. Create validation tools

### Phase 3: Migration Tools

1. Develop migration scripts for existing content
2. Create automated testing for content integrity
3. Implement fallback mechanisms for transition period
4. Create content validation reports

### Phase 4: Content Creation Tools

1. Develop template generator
2. Create command-line tools
3. Implement visual relationship editor
4. Build validation tools

### Phase 5: Documentation and Training

1. Create content authoring guidelines
2. Document content management processes
3. Develop tutorials for content creation
4. Create reference documentation for content API

## Technical Architecture

### Content Registry

```javascript
// Example of a content registry entry
{
  "id": "ch1_p1_d1",
  "type": "diorama",
  "path": "content/chapters/chapter_1/pages/001_001/dioramas/main_scene",
  "dependencies": ["layer_sky", "layer_background", "layer_foreground"],
  "metadata": {
    "name": "Main Scene",
    "createdAt": "2025-06-01",
    "updatedAt": "2025-06-23"
  },
  "config": {
    "anchorY": 0.2,
    "layers": ["sky", "background", "midground", "foreground"]
  }
}
```

### Content API Example

```javascript
// Loading content through the API
const content = await ContentManager.load({
  type: 'diorama',
  id: 'ch1_p1_d1'
});

// Finding related content
const relatedTextboxes = await ContentManager.findRelated({
  content: content,
  type: 'textbox'
});

// Creating new content
const newTextbox = await ContentManager.create({
  type: 'textbox',
  template: 'character_dialogue',
  data: {
    character: 'eene',
    text: 'Hello world!'
  },
  relatedTo: content.id
});
```

### Content Schema Example

```json
{
  "type": "diorama",
  "required": ["id", "layers", "anchorY"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for this diorama"
    },
    "layers": {
      "type": "array",
      "description": "Ordered layers in the diorama",
      "items": {
        "type": "string",
        "description": "Layer identifier"
      }
    },
    "anchorY": {
      "type": "number",
      "description": "Vertical anchor point as percentage of viewport height",
      "minimum": 0,
      "maximum": 1
    }
  }
}
```

## Benefits

1. **Improved Maintainability**
   - Clear organization of content
   - Standard patterns for content creation
   - Reduced duplication through centralized configuration
   - Easier to onboard new team members

2. **Enhanced Productivity**
   - Faster content creation through templates
   - Automated validation prevents common errors
   - Better tooling for content management
   - Clear separation of concerns

3. **Better Scalability**
   - Structure supports growing content needs
   - Configuration inheritance reduces duplication
   - Centralized registry makes content discoverable
   - API provides abstraction from storage details

4. **Improved Quality**
   - Validation ensures content meets requirements
   - Consistent structure helps prevent errors
   - Clear relationships prevent orphaned content
   - Testing infrastructure for content integrity

## Next Steps

1. Conduct detailed content audit of current system
2. Create proof of concept for content registry
3. Design initial content schemas
4. Develop mockups for directory structure
5. Review proposal with stakeholders
6. Create implementation roadmap

## Conclusion

The proposed structured content management system will provide a solid foundation for scaling the Trinkaspace project. By clearly defining content types, relationships, and processes, the system will be more maintainable and easier to extend. The centralized approach will improve efficiency in content creation while ensuring consistency across the application.
