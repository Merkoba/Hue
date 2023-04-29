module.exports = (config, sconfig, utilz, logger) => {
  // Main object
  const manager = {}

  // Hold some stuff
  const stuff = {
    config: config,
    sconfig: sconfig,
    utilz: utilz,
    logger: logger
  }

  // Fill the imports
  require(`./imports`)(stuff)

  // Fill the vars
  require(`./vars`)(stuff)

  // Get the module file names and arguments
  const modules = stuff.i.fs.readdirSync(stuff.i.path.join(__dirname, `modules`))

  // Fill the handler object
  for (let module of modules) {
    require(`./modules/${module}`)(manager, stuff)
  }

  return manager
}