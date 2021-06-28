function globalRegister () {
  return {
    name: 'sinon-chai-global-register',
    generateBundle(options, bundle, isWrite) {
      const chunk = bundle['sinon-chai.js']
      chunk.code = chunk.code.replace(/\(global.*global.sinonChai\s*=\s*factory\(\)\)/, 'chai.use(factory())')
    }
    
  };
}


export default {
  input: 'lib/sinon-chai.mjs',
  plugins: [globalRegister()],
  output: {
    file: 'lib/sinon-chai.js',
    format: 'umd',
    name: 'sinonChai',
    esModule: false
  }
};