import styles from './input.module.css';

function LoginInput(props){
    return(
        <div className={styles.inputWrap}>
            <input 
                type={props.type ? props.type : 'text'} 
                reff={props.ref}
                onChange={props.onChange}
                id={props.id}
                required
            />
            <label>{props.label}</label>
            <span></span>
        </div>
    )
}

function SearchInput(props){
    return(
        <div className={styles.search}>
            <input 
                type="text" placeholder="이름을 입력해주세요."
                value={props.value}
                onChange={props.onChange}
            />
            <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"/>
        </div>
    )
}

function Input(props){
    return(
        <div className={styles.inputWrap2}>
            <input 
                name={props.name} 
                placeholder={props.placeholder} 
                type={props.type ? props.type : 'text'} required
                onChange={props.onChange}
                value={props.value}
                onInput={props.onInput}
                maxLength={props.maxLength}
            />
        </div>
    )
}

export {LoginInput, SearchInput, Input}