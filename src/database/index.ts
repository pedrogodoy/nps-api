import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    //If the test env, use other database file
    Object.assign(defaultOptions, {
      database: 
        process.env.NODE_ENV === 'test' 
          ? "./src/database/database.test.sqlite" 
          : defaultOptions.database 
    })
  );
}

