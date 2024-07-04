const GracefulShutdown = (status: number, server: any) => {
    server.close(() => {
      process.exit(status)
    })
    // If server hasn't finished in 1000ms, shut down process
    setTimeout(() => {
      process.exit(status)
    }, 1000).unref() //prevent loop 
  }

export default { GracefulShutdown }