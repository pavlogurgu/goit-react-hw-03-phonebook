import { InputForm } from './InputForm/InputForm';
import { Component } from 'react';
import { Contacts } from './Contacts/Contacts';
import { nanoid } from 'nanoid';
import { Filter } from './Filter/Filter';
import { Container } from '../components/InputForm/InputForm.styled';

const LOCAL_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };
  componentDidMount() {
    const localContacts = localStorage.getItem(LOCAL_KEY);
    if (localContacts) {
      const contactsToJson = JSON.parse(localContacts);
      this.setState({
        contacts: contactsToJson,
      });
    }
  }
  componentDidUpdate(_, prevState) {
    const currentContacts = this.state.contacts;
    const contactsToString = JSON.stringify(currentContacts);
    const prevContacts = prevState.contacts;
    if (prevContacts.length !== currentContacts.length) {
      localStorage.setItem(LOCAL_KEY, contactsToString);
    }
  }
  checkContactAvailability = newData => {
    const { contacts } = this.state;
    return contacts.find(
      ({ name }) => name.toLowerCase() === newData.name.toLowerCase()
    );
  };

  formSubmitHandler = newData => {
    newData.id = nanoid();
    if (this.checkContactAvailability(newData)) {
      alert(`${newData.name} is already in contacts`);
      return;
    }
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newData],
    }));
  };

  contactDeleteHandler = contactId => {
    const { contacts } = this.state;
    const filteredContacts = contacts.filter(({ id }) => {
      return id !== contactId;
    });
    this.setState({
      contacts: filteredContacts,
    });
  };
  changeFilter = event => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    const normilizeFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normilizeFilter)
    );
  };

  render() {
    const { contacts, filter } = this.state;
    const visibleContacts = this.getFilteredContacts();
    return (
      <Container>
        <h2>PhoneBook</h2>
        <InputForm onSubmit={this.formSubmitHandler} />
        {contacts.length > 0 && <h3>Contacts</h3>}
        {contacts.length > 0 && (
          <Filter filterValue={filter} onValueChange={this.changeFilter} />
        )}
        <Contacts
          contacts={visibleContacts}
          onDelete={this.contactDeleteHandler}
        />
      </Container>
    );
  }
}