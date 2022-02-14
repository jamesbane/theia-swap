import styled from 'styled-components'

interface StyledPanelProps {
    padding?: number,
    color?: string
}

const StyledPanel = styled.div<StyledPanelProps>`
  background-color: ${(props: StyledPanelProps) => props.color ? props.color : 'rgb(25, 27, 31)'};
  padding: ${(props: StyledPanelProps) => props.padding ?? '20px'};
  margin-top: 20px;
  border-radius: 5px;
`
export default StyledPanel;