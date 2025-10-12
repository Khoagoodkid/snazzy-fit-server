import { Injectable } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { CreateAddressDto } from "./dto/create-address.dto";
import { BusinessLogicError } from "src/core/base.error";
import { UpdateAddressDto } from "./dto/update-address.dto";


@Injectable()
export class AddressService {
    constructor(private readonly addressRepository: AddressRepository) { }

    async createAddress(address: CreateAddressDto, userId: string) {
        try {
            const addressData = {
                customerFirstName: address.customer_first_name,
                customerLastName: address.customer_last_name,
                companyName: address.company_name || '',
                address: address.address,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
                phone: address.phone,
            }

            return this.addressRepository.create(
                {
                    ...addressData,
                    userId: userId,
                }
            );
        } catch (error) {
            throw new BusinessLogicError("Failed to create address");
        }
    }



    async getAddressesByUserId(userId: string) {
        try {
            return this.addressRepository.get({
                user_id: userId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get addresses");
        }
    }

    async updateAddress(id: string, updateAddressDto: UpdateAddressDto, userId: string) {
        try {
            return this.addressRepository.update({
                id,
                user_id: userId,
            }, updateAddressDto);
        } catch (error) {
            throw new BusinessLogicError("Failed to update address");
        }
    }

    async deleteAddress(id: string, userId: string) {
        try {
            return this.addressRepository.delete({
                id,
                user_id: userId,
            });
        }
        catch (error) {
            throw new BusinessLogicError("Failed to delete address");
        }
    }
}
