import React from 'react';
import {BranchContext} from '../providers/BranchProvider';

export default function useBranch() {
  return React.useContext(BranchContext);
}
