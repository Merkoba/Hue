module.exports = (config, sconfig, utilz, logger) => {
  // Main object
  const manager = {}

  // Object that holds all shared variables
  const vars = {}

  // Fill the vars object
  require(`./vars`)(vars, manager, config, sconfig, utilz, logger)

  // Get the module file names and arguments
  const modules = vars.fs.readdirSync(vars.path.join(__dirname, `modules`))

  // Fill the handler object
  for (let module of modules) {
    require(`./modules/${module}`)(manager, vars, config, sconfig, utilz, logger)
  }

  return manager
}