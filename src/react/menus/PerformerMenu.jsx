/**
 * @author Travis Bennett
 * @email
 * @create date 2018-08-27 10:07:30
 * @modify date 2018-08-27 10:07:30
 * @desc [description]
*/

import Icon from 'react-fa';

import { Panel, Table } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import PerformerTranslateMenu from './options/PerformerTranslateMenu';
import PerformerControlsMenu from './controls/PerformerControlsMenu';
import PerformerCameraMenu from './camera/PerformerCameraMenu';
import PerformerStylesMenu from './styles/PerformerStylesMenu';
import PerformerEffectsMenu from './effects/PerformerEffectsMenu';

class PerformerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      forceUpdate: false,
      effectPosition: {
        x: 0,
        y: 0,
      },
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate === true) {
      this.setState({ forceUpdate: false });
      return true;
    }

    if (this.props && this.state) {
      if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
        this.props = nextProps;
        return true;
      }
      return false;
    }
    return false;
  }
  changeType(performer, val) {
    performer.setType(performer.getTypes()[val]);
    this.setState({ forceUpdate: true });
  }
  changeStyle(performer, val) {
    if (val === 0) { // reset model to default
      performer.clearPerformer();
    } else {
      performer.updateStyle(performer.getStyles()[val]);
    }
    this.setState({ forceUpdate: true });
  }
  toggleVisible(performer) {
    performer.toggleVisible();
    this.setState({ forceUpdate: true });
  }
  toggleWireframe(performer) {
    performer.toggleWireframe();
    this.setState({ forceUpdate: true });
  }
  updateDelay(performer, value) {
    performer.setDelay(parseFloat(value));
    this.setState({ forceUpdate: true });
  }
  updateOffsetX(performer, value) {
    const off = performer.getOffset();
    off.x = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }
  updateOffsetY(performer, value) {
    const off = performer.getOffset();
    off.y = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }
  updateOffsetZ(performer, value) {
    const off = performer.getOffset();
    off.z = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }

  updateRotationX(performer, value) {
    const rot = performer.getRotation();
    rot.x = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }
  updateRotationY(performer, value) {
    const rot = performer.getRotation();
    rot.y = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }
  updateRotationZ(performer, value) {
    const rot = performer.getRotation();
    rot.z = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }

  handleColorChange(performer, val) {
    performer.setColor(val.hex.replace(/^#/, ''));
    this.setState({ forceUpdate: true });
  }
  handleMaterialChange(performer, val) {
    performer.setMaterial(performer.materialManager.getMaterialNames()[val]);
    this.setState({ forceUpdate: true });
  }
  handleChangeEffect(performer, val, event) {
    event.persist();
    // this.recenterEffectsPopover(event);
    performer.performerEffects.removeAll();
    if (val !== 0) {
      performer.performerEffects.add(performer.effects[val - 1]);
    }
    this.setState({
      forceUpdate: true,
    }, () => {
      this.recenterEffectsPopover(event);
    });
  }

  recenterEffectsPopover(event) {
    $('#performer-effects-popover').css('top', 'auto');
    const bottom = $('.performerMenu').height() - (this.state.effectTarget.position().top / 2) - 16;
    $('#performer-effects-popover').css('bottom', bottom);
  }

  clickOverTrigger(event) {
    this.setState({
      effectTarget: $(event.currentTarget),
    });
  }

  render() {
    if (this.props.performers.length < 1) {
      return (
        <Panel className="performerMenu" defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle><h5>Performers</h5></Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Table id="performerTable">
                <tbody>
                  <tr>
                    <td id="loadBVHRow_empty">
                    </td>
                  </tr>
                </tbody>
              </Table>
              <h6 className="loadBVHLink" onClick={this.props.openBVHChooser}>Load BVH File <Icon name="user-plus" /></h6>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      );
    }
    return (
      <Panel className="performerMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Performers</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Table id="performerTable">
              <thead>
                <tr>
                  <th>Playback</th>
                  <th>Camera</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Translate</th>
                  <th>Style</th>
                  <th>Effect</th>
                  <th>Clone</th>
                </tr>
              </thead>
              <tbody>{
                _.map(this.props.performers.getPerformers(), (performer, idx) => (
                  <tr key={idx}>
                    <td title="Control Performer">
                      <PerformerControlsMenu
                        type={performer.type}
                        actions={performer.actions}
                      />
                    </td>
                    {/* <td title="Follow Performer" onClick={this.props.togglePerformerFollow.bind(this, performer)}>{(performer.getFollowing()) ? <Icon name="ban" /> : <Icon name="video-camera" />}</td> */}
                    <td>
                      <PerformerCameraMenu
                        following={performer.getFollowing()}
                        toggleFollow={this.props.togglePerformerFollow.bind(this, performer)}
                        snorry={performer.getSnorried()}
                        toggleSnorry={this.props.togglePerformerSnorry.bind(this, performer)}
                        firstPerson={performer.getFirstPersoned()}
                        toggleFirstPerson={this.props.togglePerformerFirstPerson.bind(this, performer)}
                      />
                    </td>
                    <td title="Name"><span style={{ color: performer.color }}>{performer.name}</span></td>
                    <td title="Type"><span>{(performer.leader !== null && performer.leader !== undefined) ? performer.leader.name : performer.type}</span></td>
                    <td>
                      <PerformerTranslateMenu
                        offset={performer.getOffset()}
                        updateOffsetX={this.updateOffsetX.bind(this, performer)}
                        updateOffsetY={this.updateOffsetY.bind(this, performer)}
                        updateOffsetZ={this.updateOffsetZ.bind(this, performer)}
                        rotation={performer.getRotation()}
                        updateRotationX={this.updateRotationX.bind(this, performer)}
                        updateRotationY={this.updateRotationY.bind(this, performer)}
                        updateRotationZ={this.updateRotationZ.bind(this, performer)}
                        delay={performer.getDelay()}
                        updateDelay={this.updateDelay.bind(this, performer)}
                      />
                    </td>
                    <td>
                      <PerformerStylesMenu
                        style={performer.getStyle()}
                        styles={performer.getStyles()}
                        changeStyle={this.changeStyle.bind(this, performer)}
                        type={performer.getType()}
                        types={performer.getTypes()}
                        changeType={this.changeType.bind(this, performer)}
                        visible={performer.getVisible()}
                        toggleVisible={this.toggleVisible.bind(this, performer)}
                        wireframe={performer.getWireframe()}
                        toggleWireframe={this.toggleWireframe.bind(this, performer)}
                        color={performer.getColor()}
                        handleColorChange={this.handleColorChange.bind(this, performer)}
                        material={performer.getMaterial()}
                        materials={performer.materialManager.getMaterialNames()}
                        handleMaterialChange={this.handleMaterialChange.bind(this, performer)}
                      />
                    </td>
                    <td title="Edit Effects">
                      <PerformerEffectsMenu
                        clickOverTrigger={this.clickOverTrigger.bind(this)}
                        effects={performer.effects}
                        effect={(performer.performerEffects.effects.length > 0) ? performer.performerEffects.effects[0].id : 'No Effect'}
                        changeEffect={this.handleChangeEffect.bind(this, performer)}
                        gui={(performer.performerEffects.effects.length > 0) ? performer.performerEffects.effects[0].getGUI() : null}
                      />
                    </td>
                    <td>
                    {(performer.type === 'clone_bvh' || performer.type === 'clone_perceptionNeuron') ?
                      <Icon name="trash" title="Delete Clone" className="glyphicon glyphicon-trash" onClick={this.props.removeClone.bind(this, performer)} />
                    : <Icon name="plus" title="Create Clone" className="glyphicon glyphicon-plus" onClick={this.props.addClone.bind(this, performer)} />}
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
            <h6 className="loadBVHLink" onClick={this.props.openBVHChooser}>Load BVH File <Icon name="user-plus" /></h6>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = PerformerMenu;
