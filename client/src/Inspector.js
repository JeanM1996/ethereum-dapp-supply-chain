import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";


function Recipient(props) {

    const {drizzle, addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const [recipientId, setRecipientId] = useState("");
    const [requestId, setRequestId] = useState("1");


    // Set the Address Fields to default addresses
    useEffect(() => {
        const {accounts} = props;
        if (accounts.length > 0) {
            setRecipientId(accounts[2]);
        }
    }, [props.accounts]);

    // A recipient can approve/deny access to a certificate by an Inspector
    const decideAccess = (_canAccess) => {
        return async () => {
            if (contract) {
                const decideAccess = contract.methods["decideAccess"];
                try {
                    await decideAccess(requestId, _canAccess).send({from: recipientId}).then(
                        res => addAlert(`✅  Access decided: ${_canAccess} - Tx Hash: ${res.transactionHash}`, 'success'),
                        err => addAlert(err.message, 'danger')
                    )
                } catch (err) {
                    addAlert(err.message, 'danger')
                }
            }
        }
    };


    return (
        <>
            <Form.Group>
                <Form.Label>Recipient Account</Form.Label>
                <FormControl
                    value={recipientId}
                    onChange={(i) => setRecipientId(i.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Decide Access</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Request Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={requestId}
                        onChange={(i) => setRequestId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={decideAccess(true)}>Approve</Button>
                        <Button variant="danger" onClick={decideAccess(false)}>Deny</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
        </>
    );

}

export default Recipient;
