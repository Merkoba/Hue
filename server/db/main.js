module.exports = (config, sconfig, utilz, logger) => {
  // Main object
  const manager = {}

  // Hold stuff
  const stuff = {
    config,
    sconfig,
    utilz,
    logger,
  }

  // Fill the imports
  require(`./imports`)(stuff)

  // Fill the vars
  require(`./vars`)(stuff)

  // Get the module file names
  let modules = stuff.i.fs.readdirSync(stuff.i.path.join(__dirname, `modules`))

  // Fill the manager object
  for (let module of modules) {
    require(`./modules/${module}`)(manager, stuff)
  }

  return manager
}