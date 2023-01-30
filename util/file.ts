const fs = require('fs')

export const readTextFile = async (filename: string) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) reject('')
      resolve(data.toString())
    })
  })
}