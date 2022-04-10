import React from 'react';
import {BranchContext} from '../providers/BranchProvider';
import {TabContext} from '../providers/TabProvider';

export default function useTab() {
  return React.useContext(TabContext);
}
