import React from 'react';
//import Autocomplete from 'react-autocomplete';
import { MenuItem, AutoComplete } from 'material-ui';
import { delayOnceTimeAction } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';


const AutoCompleteSearchKeyword = React.createClass({
    propTypes: {
        value: React.PropTypes.any,
        searchId: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        onInputEnterPressed: React.PropTypes.func,
        onChange: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: this.props.value,
            itemList: [],
            loading: false,
            open: false,
            keywordDataSource: [],
            keyword: { id: '', text: '' },
        };
    },

    collapseMenu() {
        this.setState({ open: false });
    },

    // TODO: MUST TRY THIS!!
    _onInputEnterPressed(event) {
        this.props.onInputEnterPressed(event);
        this.collapseMenu();
    },

    _onUpdatekeywords(value) {

        this.setState({ value, loading: true, open: false });
        // Call back the parent passed in method for change 
        this.props.onChange(event, value);


        delayOnceTimeAction.bind(700, this.props.searchId, () => {
            if (value === '') {
                this.setState({ keywordDataSource: [], keyword: { id: '', text: '' } });
                this.props.onSelect({ text: '', id: '' });
            }
            else {
                getD2().then(d2 => {
                    const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

                    d2.Api.getApi().get(url).then(result => {
                        const keywordList = [];

                        for (const user of result.interpretations) {
                            const source = { id: user.id, text: `${user.text}` };
                            keywordList.push({ text: source.text, value: <MenuItem primaryText={source.text} value={source.id} />, source });
                        }

                        this.setState({ keywordDataSource: keywordList });

                        // this.setState({ itemList: result.interpretations, loading: false, open: openVal });
                    })
                    .catch(errorResponse => {
                        console.log(`error ${errorResponse}`);
                    });
                });
            }
        });
    },

    _onSelectkeyword(value, i) {
        // If keyword is empty, 'Enter' was hit, probably
        console.log( '_onSelectkeyword i: ' + i );

        if (i < 0) {
        }
        else {
            // Set real keyword here with setstate!!
            this.state.keyword = this.state.keywordDataSource[i].source;
            this.props.onSelect(this.state.keyword);
        }
    },

    render() {
        return (
            <AutoComplete hintText="Search Interpretation"
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdatekeywords}
                onNewRequest={this._onSelectkeyword}
                dataSource={this.state.keywordDataSource}
                style={{ width: '540px' }}
            />	    
        );
    },
});

/*
            <div className="searchTextDiv">
                <AutocompleteMod
                    className="searchTextbox"
                    inputProps={{ hintText: 'Search Interpretation', style: { width: '400px' } }}
                    ref="autocomplete"
                    value={this.state.value}
                    items={this.state.itemList}
                    getItemValue={(item) => item.text}
                    open={this.state.open}
                    onInputEnterPressed={this._onInputEnterPressed}
                    onSelect={(value, item) => {
                        this.setState({ value, itemList: [item], open: false });
                        this.props.onSelect(item);
                    }}
                    onChange={(event, value) => {
                        this.setState({ value, loading: true, open: false });

                        // Call back the parent passed in method for change 
                        this.props.onChange(event, value);

                        delayOnceTimeAction.bind(700, this.props.searchId, () => {
                            if (value === '') {
                                this.setState({ itemList: [], loading: false, open: false });
                                this.props.onSelect({ text: '', id: '' });
                            }
                            else {
                                getD2().then(d2 => {
                                    const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

                                    d2.Api.getApi().get(url).then(result => {
                                        const openVal = (result.interpretations.length > 0) ? true: false;

                                        this.setState({ itemList: result.interpretations, loading: false, open: openVal });
                                    })
                                    .catch(errorResponse => {
                                        console.log(`error ${errorResponse}`);
                                    });
                                });
                            }
                        });
                    }}
                    renderItem={(item, isHighlighted) => (
                        <div className="searchItemsDiv" style={isHighlighted ? autoSearchStyles.highlightedItem : autoSearchStyles.item}
                            key={item.id}
                            id={item.id}
                        >{item.text}</div>
                    )}
                />
            </div>
*/

export default AutoCompleteSearchKeyword;
