import React, { Component } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DragIcon from '../../static/icons/menu.svg';
import { updateRoadmapCollapsedState } from '../../ducks/growBoard';

const ModulesWrapper = styled.div`
  width: ${props => (props.hoveredRoadlist ? '25vw' : '23vw')};
  background: #fff;
  overflow-y: scroll;
  height: 100vh;
  z-index: 2;
  position: relative;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #fff;
  }

  ::-webkit-scrollbar {
    width: 9px;
    background-color: #ecedef;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ecedef;
  }
`;

const ModulesTitleWrapper = styled.div`
  color: #5b5f64;
  font-size: 20px;
  padding: 25px 25px;
  height: 5vh;
`;

const NewModuleWrapper = styled.div`
  background: #4427f1;
  color: #fff;
  -webkit-box-shadow: 0px 0px 7px -4px rgba(68, 39, 241, 0.45);
  -moz-box-shadow: 0px 0px 7px -4px rgba(68, 39, 241, 0.45);
  box-shadow: 0px 0px 7px -4px rgba(68, 39, 241, 0.45);
  font-weight: 900;
  font-size: 25px;
  position: absolute;
  top: 0;
  right: 25px;
  padding: 5px 10px;
  padding-top: 25px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
`;

const CardListWrapper = styled.div`
  padding: 0px 25px;
  overflow: hidden;
`;

const DraggablesHolder = styled.div``;

const ItemDraggableWrapper = styled.div`
  background: ${props => (props.isDragging ? '#4427f1' : '#fff')};
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background 1s;
  box-sizing: border-box !important;

  h1 {
    color: ${props => (props.isDragging ? '#fff' : '#5b5f64')};
    font-size: 17px;
    font-weight: 400;
    margin-bottom: 0px;
    margin-top: 0px;
    transition: color 1s;
  }

  h2 {
    color: ${props => (props.isDragging ? '#fff' : '#bbbcbd')};
    font-size: 10px;
    font-weight: 400;
    margin-bottom: 0px;
    margin-top: 3px;
    transition: color 1s;
  }
`;

const IconHolder = styled.div`
  width: 13px;
  height: 13px;
  margin-right: 15px;
  svg {
    fill: #c7c8ca;
  }
`;

const RoadmapCollapsibleElement = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 7px;
  height: 100%;
  transition: all 0.3s ease;
  :hover {
    width: 7px;
    background: #cecece;
    cursor: pointer;
  }
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleList: [],
      RoadlistCollapsibleHovered: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    this.setState({
      moduleList: this.props.dataFromSelectedRoadmap.modules,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dataFromSelectedRoadmap.modules !==
      this.props.dataFromSelectedRoadmap.modules
    ) {
      this.setState({
        moduleList: this.props.dataFromSelectedRoadmap.modules,
      });
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const moduleList = reorder(
      this.state.moduleList,
      result.source.index,
      result.destination.index
    );

    this.setState({
      moduleList,
    });
  }

  handleHoverRoadlist = value => {
    this.setState({
      RoadlistCollapsibleHovered: value,
    });
  };

  handleHasContent = () => {
    return (
      <CardListWrapper>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <DraggablesHolder
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {this.state.moduleList &&
                  this.state.moduleList.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      onClick={() => this.updateSelectedModule(item.id)}
                    >
                      {(provided, snapshot) => (
                        <ItemDraggableWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                        >
                          <IconHolder>
                            <DragIcon />
                          </IconHolder>
                          <div>
                            <h1>{item.title}</h1>
                            <h2>{item.description}</h2>
                          </div>
                        </ItemDraggableWrapper>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </DraggablesHolder>
            )}
          </Droppable>
        </DragDropContext>
      </CardListWrapper>
    );
  };

  handleHasNoContent = () => {
    return(
      'a'
    )
  }

  render() {
    return (
      <ModulesWrapper hoveredRoadlist={this.state.RoadlistCollapsibleHovered}>
        <RoadmapCollapsibleElement
          onClick={() => this.props.updateRoadmapCollapsedState()}
          onMouseOver={() => this.handleHoverRoadlist(true)}
          onMouseOut={() => this.handleHoverRoadlist(false)}
        />
        <NewModuleWrapper>+</NewModuleWrapper>
        <ModulesTitleWrapper>
          {this.props.dataFromSelectedRoadmap.name} Modules
        </ModulesTitleWrapper>
          {this.props.dataFromSelectedRoadmap.length === 0 ? this.handleHasNoContent() : this.handleHasContent()}
      </ModulesWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedRoadmap: state.growBoardReducer.selectedRoadmap,
    dataFromSelectedRoadmap: state.growBoardReducer.dataFromSelectedRoadmap,
    roadmapCollapsed: state.growBoardReducer.roadmapCollapsed,
  };
}

const mapDispatchToProps = {
  updateRoadmapCollapsedState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modules);
