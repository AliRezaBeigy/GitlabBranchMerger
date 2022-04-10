import React from 'react';
import {RepositoryContext} from '../providers/RepositoryProvider';

export default function useRepository() {
  return React.useContext(RepositoryContext);
}
