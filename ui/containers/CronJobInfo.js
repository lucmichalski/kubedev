import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import DeleteButton from '../components/DeleteButton';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

const CustomInput = styled(Input)`
  font-size: 14px;
`;

export default function CronJobInfo({ namespace, name, navigate }) {
  const [schedule, setSchedule] = useState('');
  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, `get cronjob ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  //TODO not working
  const handleSchedule = () => {
    kubectl
      .exec(
        namespace,
        `patch cronjob ${name} -p '{"spec":{"schedule": "${schedule}"}}'`,
        false
      )
      .then(() => revalidate())
      .catch(err => console.error(err));
  };

  const handleEdit = () => {
    navigate(`/ui/${namespace}/cronjobs/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete cronjob ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/cronjobs`))
      .catch(err => console.error(err));
  };

  const {
    data: { metadata, spec, status }
  } = response || {};

  useMemo(() => setSchedule(spec.schedule), [spec.schedule]);

  return (
    <div>
      <PageHeader title={metadata.name}>
        <DeleteButton name={metadata.name} onClick={handleDelete}>
          DELETE
        </DeleteButton>
        <Button onClick={handleEdit}>EDIT</Button>
        <Button onClick={handleSchedule}>SAVE</Button>
      </PageHeader>
      <CustomTable>
        <thead>
          <tr>
            <th>Schedule</th>
            <th>Schedule Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <CustomInput
                type="text"
                placeholder="Schedule"
                value={schedule}
                onChange={event => setSchedule(event.target.value)}
              />
            </td>
            <td>{status.lastScheduleTime}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
