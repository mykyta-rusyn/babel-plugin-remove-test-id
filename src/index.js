const typesAttributes = {};
const typesAttributeName = {
  ImportDeclaration: 'importFileNames',
  MemberExpression: 'testIdObjects',
  JSXAttribute: 'jSXAttributes',
  ObjectProperty: 'objectProperties',
};

function getAttributes(attributes, type) {
  if (typesAttributes[type] !== undefined) {
    return typesAttributes[type];
  }

  if (!attributes) {
    return;
  }

  if (Array.isArray(attributes)) {
    if (
      attributes.length === 0 ||
      attributes.length !== attributes.filter((attr) => 
        typeof attr === 'string' && attr.trim()
      ).length
    ) {
      return;
    }
    typesAttributes[type] = attributes;
  } else if (typeof attributes === 'string') {
    typesAttributes[type] = [attributes];
  } else {
    return;
  }
  return typesAttributes[type];
}

function isChildren(node, path) {
  const keys = path.split('.');
  let currentObj = node;

  for (const key of keys) {
    if (currentObj.hasOwnProperty(key)) {
      currentObj = currentObj[key];
    } else {
      return false;
    }
  }

  return true;
}

function inArray(array, value, isImport = false) {
  return array.some((element) => {
    if (isImport) {
      return value.includes(element);
    }
    return value === element
  });
}

module.exports = () => {
  function ObjectProperty(path, state, overridedType) {
    const attributes = getAttributes(
      state.opts[typesAttributeName.ObjectProperty],
      overridedType ?? 'ObjectProperty',
    );
    if (attributes === undefined) {
      return;
    }

    if (
      isChildren(path, 'node.key.name') &&
      inArray(attributes, path.node.key.name)
    ) {
      path.remove();
    }
  }

  const visitor = {
    ObjectProperty,
    ObjectTypeProperty: (path, state) =>
      ObjectProperty(path, state, 'ObjectTypeProperty'),
    ImportDeclaration(path, state) {
      const attributes = getAttributes(
        state.opts[typesAttributeName.ImportDeclaration],
        'ImportDeclaration',
      );
      if (attributes === undefined) {
        return;
      }

      if (
        isChildren(path, 'node.source.value') &&
        inArray(attributes, path.node.source.value, true)
      ) {
        path.remove();
      }
    },
    MemberExpression(path, state) {
      const attributes = getAttributes(
        state.opts[typesAttributeName.MemberExpression],
        'MemberExpression',
      );
      if (attributes === undefined) {
        return;
      }

      if (
        isChildren(path, 'node.object.name') &&
        isChildren(path, 'parent.type') &&
        inArray(attributes, path.node.object.name)
      ) {
        if (path.parent.type === 'CallExpression') {
			    path.replaceWithSourceString(undefined)
        } else {
          path.remove()
        }
      }
    },
    Identifier(path, state) {
      const attributes = getAttributes(
        state.opts[typesAttributeName.MemberExpression],
        'Identifier',
      );
      if (attributes === undefined) {
        return;
      }

      if (
        isChildren(path, 'node.name') &&
        inArray(attributes, path.node.name) &&
        isChildren(path, 'parent.type')
      ) {
        if (path.parent.type !== 'CallExpression') {
          path.remove();
        } else {
          path.replaceWithSourceString(undefined)
        }
      }
    },
    JSXAttribute(path, state) {
      const attributes = getAttributes(
        state.opts[typesAttributeName.JSXAttribute],
        'JSXAttribute',
      );
      if (attributes === undefined) {
        return;
      }

      if (
        isChildren(path, 'node.attributes') &&
        inArray(attributes, path.node.name.name)
      ) {
        path.remove();
      }
    },
    CallExpression(path, state) {
      const attributes = getAttributes(
        state.opts[typesAttributeName.CallExpression],
        'CallExpression',
      );
      if (attributes === undefined) {
        return;
      }

      if (
        isChildren(path, 'path.node.callee.object.name') &&
        inArray(attributes, path.node.callee.object.name)
      ) {
        path.remove()
      }
    }
  };

  return {
    visitor,
  };
};
