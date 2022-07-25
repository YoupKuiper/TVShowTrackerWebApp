import React from 'react'
import './MainSearchBar.css'

export const MainSearchBar = () => {

    const classes = 'searchBar verticalCenter'
    return (
        <div>
            <input className={classes} maxLength={2048} type='text' aria-autocomplete='both' aria-haspopup='false' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false' title='Search'></input>
        </div>
    )
}