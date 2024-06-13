import { Dropdown, Option } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { OptionOnSelectData, SelectionEvents } from '@fluentui/react-combobox';
import { IProject } from '@/src/types/video.types';

export const ProjectDropdown = ({
  projects,
  defaultProject,
  onProjectSelect,
  readonly = false,
}: IProjectDropdownProps) => {
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    '',
  );

  const onProjectChange = (
    event: SelectionEvents,
    data: OptionOnSelectData,
  ) => {
    setSelectedProject(data.optionText);
    onProjectSelect && onProjectSelect(data.optionValue || '');
  };

  useEffect(() => {
    const project = projects.find((project) => project.id === defaultProject);
    if (project) {
      setSelectedProject(project.projectName);
    }
  }, [defaultProject]);

  return (
    <Dropdown
      value={selectedProject}
      onOptionSelect={onProjectChange}
      disabled={readonly}
    >
      {projects.map((project) => (
        <Option key={project.id} value={project.id}>
          {project.projectName}
        </Option>
      ))}
    </Dropdown>
  );
};

export interface IProjectDropdownProps {
  projects: IProject[];
  defaultProject?: string;
  readonly?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

export default ProjectDropdown;
