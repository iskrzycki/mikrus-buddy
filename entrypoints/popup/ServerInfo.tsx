import React from "react";

interface ServerInfoProps {
  responseData: any;
}

const ServerInfo: React.FC<ServerInfoProps> = ({ responseData }) => {
  return (
    <div>
      <p>
        <strong>Server id:</strong> {responseData.server_id}
      </p>
      {responseData.server_name && (
        <p>
          <strong>Server name:</strong> {responseData.server_name}
        </p>
      )}
      <p>
        {/* // TODO date formatting */}
        <strong>Expires:</strong> {responseData.expires}
      </p>
      <p>
        <strong>RAM:</strong> {responseData.param_ram} mb
      </p>
      <p>
        <strong>HDD:</strong> {responseData.param_disk} gb
      </p>
      <p>
        <strong>mikr.us pro:</strong> {responseData.mikrus_pro}
      </p>
      <p>
        <strong>uptime:</strong> {responseData.uptime}
      </p>
      <p>
        <strong>memory:</strong> {JSON.stringify(responseData.memory)}
        {/* TODO handle memory */}
        {/* {"total":1280,"used":899,"free":167,"shared":0,"buffCache":212,"available":380,"swapTotal":0,"swapUsed":0,"swapFree":0} */}
      </p>
      {/* TODO HANDLE THESE FIELDS */}
      {/* <div><strong>expires_cytrus:</strong> {responseData.expires_cytrus !== null ? responseData.expires_cytrus : 'null'}</div> */}
      {/* <div><strong>expires_storage:</strong> {responseData.expires_storage !== null ? responseData.expires_storage : 'null'}</div> */}
      {/* <div><strong>lastlog_panel:</strong> {responseData.lastlog_panel}</div> */}
    </div>
  );
};

export default ServerInfo;
