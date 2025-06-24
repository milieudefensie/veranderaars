import React from 'react';
import { graphql, navigate, useStaticQuery } from 'gatsby'; // @ts-expect-error
import { BotProtectionProvider, BotProtectionStatus, ProtectedLink } from '../../Global/BotProtection/BotProtection';

import './styles.scss';

interface SignalGroup {
  id: string;
  title: string;
  signalChat: string;
}

interface QueryResult {
  allDatoCmsGroup: {
    nodes: SignalGroup[];
  };
}

const BlockGroupsSignal: React.FC = () => {
  const data = useStaticQuery<QueryResult>(graphql`
    query SignalChat {
      allDatoCmsGroup(filter: { signalChat: { ne: "" } }, sort: { title: ASC }) {
        nodes {
          id
          title
          signalChat
        }
      }
    }
  `);

  const signalGroups = data.allDatoCmsGroup;

  if (!signalGroups || signalGroups.nodes.length === 0) {
    return null;
  }

  return (
    <div className="ui-block-groups-signal">
      <BotProtectionProvider turnstileMode="managed" sessionDuration={60}>
        <BotProtectionStatus buttonLabel="Open Signal" />
        <div className="row mt-5">
          {signalGroups.nodes.map((group) => (
            <div key={group.id} className="col-md-6 mb-3">
              <ProtectedLink
                to={group.signalChat}
                className="custom-btn custom-btn-primary w-100"
                onClick={() => {
                  navigate(group.signalChat);
                }}
              >
                {group.title}
              </ProtectedLink>
            </div>
          ))}
        </div>
      </BotProtectionProvider>
    </div>
  );
};

export default BlockGroupsSignal;
