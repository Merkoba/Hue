module.exports = function(db, config, sconfig, utilz, logger)
{
	// Main object
	const manager = {}

	// Object that holds all shared variables
	const vars = {}

	// Fill the vars object
	require("./vars")(vars, manager, ...arguments)

	// Get the module file names and arguments
	const modules = vars.fs.readdirSync(vars.path.join(__dirname, "modules"))
	
	// Arguments to send to modules
	const module_arguments = [manager, vars, ...arguments]

	// Fill the handler object
	for(let module of modules)
	{
		require(`./modules/${module}`)(...module_arguments)
	}

	return manager
}