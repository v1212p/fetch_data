import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Define the type for a row in the CSV data
type CsvData = {
  appid: string;
  appname: string;
  environments: string;
  memory_usage: number;
  memory_allocated: number;
  cpu_usage: number;
  cpu_allocated: number;
};

// Define the type for the result of Papa.parse
type PapaParseResult<T> = {
  data: T[];
  errors: any[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    fields: string[];
    truncated: boolean;
    cursor: number;
  };
};

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [appid, setAppid] = useState('');
  const [environments, setEnvironments] = useState<string[]>([]);
  const [details, setDetails] = useState<CsvData[]>([]);

  useEffect(() => {
    fetch('/yourfile.csv')
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (results: PapaParseResult<CsvData>) => {
            console.log('Parsed CSV Data:', results.data); // Debug: Log parsed data
            setCsvData(results.data);
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching the CSV file:', error);
      });
  }, []);

  const fetchEnvironments = () => {
    console.log('Fetching environments for appid:', appid); // Debug: Log appid
    const filteredData = csvData.filter((item) => item.appid === appid);
    console.log('Filtered Data:', filteredData); // Debug: Log filtered data
    const uniqueEnvironments = Array.from(
      new Set(filteredData.map((item) => item.environments))
    );
    console.log('Unique Environments:', uniqueEnvironments); // Debug: Log unique environments
    setEnvironments(uniqueEnvironments);
  };

  const fetchDetails = (environment: string) => {
    const filteredDetails = csvData.filter(
      (item) => item.appid === appid && item.environments === environment
    );
    setDetails(filteredDetails);
  };

  return (
    <div>
      <input
        type="text"
        value={appid}
        onChange={(e) => setAppid(e.target.value)}
        placeholder="Enter App ID"
      />
      <button onClick={fetchEnvironments}>Fetch Environments</button>

      {environments.length > 0 && (
        <ul>
          {environments.map((env) => (
            <li key={env} onClick={() => fetchDetails(env)}>
              {env}
            </li>
          ))}
        </ul>
      )}

      {details.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>App Name</th>
              <th>Memory Usage</th>
              <th>Memory Allocated</th>
              <th>CPU Usage</th>
              <th>CPU Allocated</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr key={index}>
                <td>{detail.appname}</td>
                <td>{detail.memory_usage}</td>
                <td>{detail.memory_allocated}</td>
                <td>{detail.cpu_usage}</td>
                <td>{detail.cpu_allocated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
