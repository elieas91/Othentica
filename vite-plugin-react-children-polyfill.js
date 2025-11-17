/**
 * Vite plugin to ensure React.Children polyfill is applied before react-datepicker
 */
export function reactChildrenPolyfill() {
  return {
    name: 'react-children-polyfill',
    generateBundle(options, bundle) {
      // Find the main bundle file
      const mainBundle = Object.keys(bundle).find(key => 
        bundle[key].type === 'chunk' && 
        bundle[key].isEntry
      );
      
      if (mainBundle && bundle[mainBundle]) {
        const chunk = bundle[mainBundle];
        
        // Add the polyfill code at the very beginning of the main bundle
        const polyfillCode = `
// React.Children Polyfill - Applied by Vite plugin
(function() {
  if (typeof window !== 'undefined' && window.React && !window.React.Children) {
    const ReactChildren = {
      map: (children, fn, context) => {
        if (children === null || children === undefined) return children;
        const result = [];
        let count = 0;
        const traverse = (child) => {
          if (child !== null && child !== undefined) {
            const mappedChild = fn.call(context, child, count++);
            if (Array.isArray(mappedChild)) {
              result.push(...mappedChild);
            } else if (mappedChild !== null && mappedChild !== undefined) {
              result.push(mappedChild);
            }
          }
        };
        if (Array.isArray(children)) {
          children.forEach(traverse);
        } else {
          traverse(children);
        }
        return result;
      },
      forEach: (children, fn, context) => {
        if (children === null || children === undefined) return;
        let count = 0;
        const traverse = (child) => {
          if (child !== null && child !== undefined) {
            fn.call(context, child, count++);
          }
        };
        if (Array.isArray(children)) {
          children.forEach(traverse);
        } else {
          traverse(children);
        }
      },
      count: (children) => {
        let count = 0;
        const traverse = (child) => {
          if (child !== null && child !== undefined) count++;
        };
        if (Array.isArray(children)) {
          children.forEach(traverse);
        } else {
          traverse(children);
        }
        return count;
      },
      only: (children) => {
        if (children === null || children === undefined) {
          throw new Error('React.Children.only expected to receive a single React element child.');
        }
        if (Array.isArray(children)) {
          if (children.length !== 1) {
            throw new Error('React.Children.only expected to receive a single React element child.');
          }
          return children[0];
        }
        return children;
      },
      toArray: (children) => {
        const result = [];
        const traverse = (child) => {
          if (child !== null && child !== undefined) {
            result.push(child);
          }
        };
        if (Array.isArray(children)) {
          children.forEach(traverse);
        } else {
          traverse(children);
        }
        return result;
      }
    };
    
    window.React.Children = ReactChildren;
    console.log('React.Children polyfill applied by Vite plugin');
  }
})();
`;
        
        // Prepend the polyfill code to the main bundle
        chunk.code = polyfillCode + '\n' + chunk.code;
      }
    }
  };
}
