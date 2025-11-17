/**
 * React.Children Polyfill for React 18 Compatibility
 * 
 * This polyfill provides React.Children functionality that was deprecated in React 18
 * but is still required by react-datepicker v8.7.0.
 * 
 * The polyfill must be imported before any React imports to ensure it's available
 * when react-datepicker initializes.
 * 
 * This version works by patching the global React object before React is imported.
 */

// Helper function to check if a value is a valid React element
const isValidElement = (object) => {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === Symbol.for('react.element')
  );
};

// Helper function to check if a value is a valid React child
const isValidChild = (child) => {
  return child !== null && child !== undefined;
};

// React.Children.forEach implementation
const forEachChildren = (children, fn, context) => {
  if (children === null || children === undefined) {
    return;
  }

  let count = 0;
  const traverse = (child) => {
    if (isValidChild(child)) {
      fn.call(context, child, count++);
    }
  };

  if (Array.isArray(children)) {
    children.forEach(traverse);
  } else {
    traverse(children);
  }
};

// React.Children.map implementation
const mapChildren = (children, fn, context) => {
  if (children === null || children === undefined) {
    return children;
  }

  const result = [];
  let count = 0;

  // Use our own forEach implementation instead of React.Children.forEach to avoid circular dependency
  forEachChildren(children, (child) => {
    const mappedChild = fn.call(context, child, count++);
    if (Array.isArray(mappedChild)) {
      result.push(...mappedChild);
    } else if (mappedChild !== null && mappedChild !== undefined) {
      result.push(mappedChild);
    }
  });

  return result;
};

// React.Children.count implementation
const countChildren = (children) => {
  let count = 0;
  forEachChildren(children, () => {
    count++;
  });
  return count;
};

// React.Children.only implementation
const onlyChild = (children) => {
  if (!isValidChild(children)) {
    throw new Error('React.Children.only expected to receive a single React element child.');
  }

  if (Array.isArray(children)) {
    if (children.length !== 1) {
      throw new Error('React.Children.only expected to receive a single React element child.');
    }
    return children[0];
  }

  return children;
};

// React.Children.toArray implementation
const toArray = (children) => {
  const result = [];
  forEachChildren(children, (child) => {
    result.push(child);
  });
  return result;
};

// Create the React.Children object
const ReactChildren = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  only: onlyChild,
  toArray: toArray
};

// Store the polyfill for later application
const applyPolyfill = () => {
  // Apply to global React if it exists
  if (typeof window !== 'undefined' && window.React && !window.React.Children) {
    window.React.Children = ReactChildren;
    console.log('React.Children polyfill applied to window.React');
  }
  
  // Also try to apply to any existing React in the global scope
  if (typeof globalThis !== 'undefined' && globalThis.React && !globalThis.React.Children) {
    globalThis.React.Children = ReactChildren;
    console.log('React.Children polyfill applied to globalThis.React');
  }
};

// Apply immediately if React is already available
applyPolyfill();

// Store the polyfill globally for immediate access
if (typeof window !== 'undefined') {
  window.__ReactChildrenPolyfill = ReactChildren;
}

// Also store on globalThis for broader compatibility
if (typeof globalThis !== 'undefined') {
  globalThis.__ReactChildrenPolyfill = ReactChildren;
}

// Set up a more aggressive polyfill application
if (typeof window !== 'undefined') {
  // Try to apply the polyfill immediately and repeatedly
  const applyPolyfillAggressively = () => {
    if (window.React && !window.React.Children) {
      window.React.Children = ReactChildren;
      console.log('React.Children polyfill applied aggressively');
      return true;
    }
    return false;
  };
  
  // Apply immediately
  applyPolyfillAggressively();
  
  // Apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPolyfillAggressively);
  } else {
    applyPolyfillAggressively();
  }
  
  // Apply on window load
  window.addEventListener('load', applyPolyfillAggressively);
  
  // Apply periodically for a short time
  let attempts = 0;
  const maxAttempts = 100; // 2 seconds of attempts
  const interval = setInterval(() => {
    attempts++;
    if (applyPolyfillAggressively() || attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 20);
  
  // Also try to intercept React when it's imported
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'React' && obj === window && descriptor.value && !descriptor.value.Children) {
      descriptor.value.Children = ReactChildren;
      console.log('React.Children polyfill applied via defineProperty interception');
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
}

// Export the polyfill for manual application if needed
export default ReactChildren;
