//as we are accessing our application with a http://localhost prefix, we need to update our jest configuration

import { shallow, render, mount, configure } from 'enzyme';
//import Adapter from 'enzyme-adapter-react-16';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// React 16 Enzyme adapter
configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.matchMedia = global.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    }
  }