const typesAttributes = {};
const typesAttributeName = {
  ImportDeclaration: 'importFileName',
  MemberExpression: 'importName',
  JSXOpeningElement: 'jsxAttributes',
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
      attributes.filter(attr => typeof attr === 'string' && attr.trim()).length
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

function inArray(array, value) {
  return array.some(element => value.includes(element));
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
        inArray(attributes, path.node.source.value)
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
        inArray(attributes, path.node.object.name)
      ) {
        path.replaceWithSourceString(undefined);
      }
    },
  };

  return {
    visitor,
  };
};
