import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as ForwardIcon } from './forward.svg';
import { generatePolicyChanger } from '../../services/policyChanger';
import './Forwarding.css';

function Forwarding({ encryptState, userId, policy, updatePolicy }) {
  const policyChange = change => generatePolicyChanger(policy, updatePolicy, change);
  const onChange = policyChange((builder, e) =>
    e.target.checked ? builder.disableReshare() : builder.enableReshare(),
  );
  return (
    <div className="Forwarding">
      <SectionHeader>
        <ForwardIcon />
        <h4>Forwarding</h4>
        <Toggle id="forward" checked={policy && !policy.hasReshare()} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Forwarding;
