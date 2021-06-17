/**
 * @author Travis Bennett
 * @email
 * @create date 2018-08-26 08:36:36
 * @modify date 2018-08-26 08:36:36
 * @desc [Modal overlay to select or upload bvh files to client.]
*/



import { Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import Icon from 'react-fa';

import List from 'react-list-select';

import Common from '../../util/Common';

export class BVHChooserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: null,
      filetype: null,
      selected: [],
      disabled: [],
    };
  }

  // only update if something changed
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate == true) {
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

  // read dropped file with the FileReader API (no server)
  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles,
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        selected: [],
        file: reader.result,
        filetype: 'raw',
      });
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(acceptedFiles[0]);
  }

  // once new file is dectect, load bvh for playback
  loadFile() {
    switch(this.state.filetype) {
      default:
      case 'raw':
        this.props.rawBvhUpload(this.state.file, true);
        break;
      case 'url':
        this.props.urlBvhUpload(this.state.file, true);
        break;
    }
  }

  componentDidMount() {
    this.setState(prevState => ({
      file: "./animations/bvh/Parov_Stelar_-_Catgroove_TSC_-_Forsythe-twqM56f_cV.bvh",
      filetype: 'url',
      selected: [0],
    }), () => {
      this.loadFile()
    });
  }

  // select file from list
  fileSelected(number) {
    const f = this.props.bvhFiles[number];
    console.log(f)
    this.setState(prevState => ({
      file: f,
      filetype: 'url',
      selected: [number],
    }));
  }

  render() {
    return (
      <Modal backdrop={(this.props.performers.length < 1) ? true : true} show={this.props.show} onHide={this.props.closeBVHChooser}>
        <Modal.Header
          closeButton={(this.props.performers.length < 1) ? true : true}
          className="chooserHeader">
          <Modal.Title>
            <span>Welcome to</span>
            <div className="modal-image">
              <img alt="OP Logo" height="100%" width="auto" src={'images/op_logo_lockup.png'} />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid fluid>
            <Row className="chooserTitle">
              <Col sm={1} />
              <Col sm={4}>
                <h5>Choose Example File</h5>
              </Col>
              <Col sm={2}>
                <h5>or</h5>
              </Col>
              <Col sm={4}>
                <h5>Upload Your Own BVH</h5>
              </Col>
              <Col sm={1} />
            </Row>
            <Row className="show-grid">
              <Col sm={6}>
                <List
                  items={_.map(this.props.bvhFiles, (url) => {
                    const urlParts = url.split('/');
                    const nameParts = urlParts[urlParts.length - 1].split('.')[0].split('_');
                    return _.map(nameParts, (part) => {
                      return Common.capitalizeFirstLetter(part);
                    }).join(' ');
                  })}
                  selected={this.state.selected}
                  disabled={this.state.disabled}
                  multiple={false}
                  onChange={this.fileSelected.bind(this)}
                />
              </Col>
              <Col sm={6}>
                <Dropzone
                  className={(this.state.filetype === 'raw' ? ' dropzone dropzoneLoaded' : 'dropzone')}
                  activeClassName="dropzoneActive"
                  rejectClassName="dropzoneReject"
                  // accept="application/octet-stream"
                  onDrop={this.onDrop.bind(this)}
                >
                  <Icon name="upload" size="5x"/>
                  <p>Drop BVH file here<br />(or click to select file)</p>
                </Dropzone>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={"BVHUploadButton"}
            title={(this.state.file === null) ? 'Please Select File' : 'Click to Load File'}
            disabled={(this.state.file === null) ? true : false} onClick={this.loadFile.bind(this)}
            bsStyle="primary"
          >
            Load File
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export class BasicBVHChooserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: null,
      filetype: null,
      selected: [],
      disabled: [],
    };
  }

  // only update if something changed
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate == true) {
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

  // read dropped file with the FileReader API (no server)
  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles,
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        selected: [],
        file: reader.result,
        filetype: 'raw',
      });
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(acceptedFiles[0]);
  }

  // once new file is dectect, load bvh for playback
  loadFile() {
    switch(this.state.filetype) {
      default:
      case 'raw':
        this.props.rawBvhUpload(this.state.file, true);
        break;
      case 'url':
        this.props.urlBvhUpload(this.state.file, true);
        break;
    }
  }

  loadDefault() {
    let windowUrl = window.location.search;
    let params = new URLSearchParams(windowUrl);
    // console.log(windowUrl);
    console.log(params.get("name"));
    let bvhUrl = params.get("name");
    this.setState(prevState => ({
      // file: "https://metagen.storage.googleapis.com/generated/stelar.bvh",
      // file: "https://drive.google.com/file/d/1iOw6uO8kVbhJqsJyarbMAhrnCrqiRxHA/view?usp=sharing",
      file: "https://metagendance.storage.googleapis.com/"+bvhUrl+".bvh",
      filetype: 'url',
      selected: [0],
    }), () => {
      this.loadFile()
    });
  }

  render() {
    return (
      <Modal aria-labelledby="contained-modal-title-vcenter" show={this.props.show} onHide={this.props.closeBVHChooser} centered>
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Modal.Title className={"BVHUploadTitle"}>
            <span>Click the button below</span>
            {/*<div className="modal-image">*/}
            {/*  <img alt="OP Logo" height="100%" width="auto" src={'images/op_logo_lockup.png'} />*/}
            {/*</div>*/}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <Button
            className={"BVHUploadButton"}
            // title={(this.state.file === null) ? 'Please Select File' : 'Click to Load Default File'}
            onClick={this.loadDefault.bind(this)}
            // bsStyle="primary"
          >
            Load File
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

// module.exports = BVHChooserModal;
